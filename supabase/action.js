// /supabase/action.js
// Supabase와 통신하는 로직만 모아둔 파일입니다.
// - 회원가입 (auth.users + profiles)
// - 방명록 작성 (guestbook insert)
// - 방명록 목록 조회 (guestbook_list view select)
//
// 폼 값 읽기 / 화면 렌더링은 각 페이지 스크립트에서 담당하고,
// 이 파일은 결과값(data)과 성공 여부만 돌려줍니다.

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ============================================================
// 0. Supabase 클라이언트 초기화
//    이 프로젝트는 빌드 스텝 없이 정적 파일을 그대로 배포하므로
//    (Vite 등 번들러 X) import.meta.env 문법을 쓸 수 없습니다.
//    anon key는 service_role과 달리 브라우저에 노출되는 게 전제된 공개 값이라
//    직접 값을 넣어도 안전합니다. (실제 접근 제어는 RLS 정책이 담당)
//    ※ URL은 프로젝트 루트만 넣습니다. /rest/v1/, /auth/v1/ 등은
//      supabase-js가 내부적으로 알아서 붙이므로 여기 포함하면 안 됩니다.
// ============================================================
const SUPABASE_URL = "https://smueidujxqbamjkhlfuj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdWVpZHVqeHFiYW1qa2hsZnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNDg2MzgsImV4cCI6MjA5OTkyNDYzOH0.gPuqFWB6Sji8T4V_IjKnJsOPHu_1thrtoRIrixUax8A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// 1. 회원가입
// ============================================================

/**
 * 이메일 입력값 + 도메인 select 값을 하나의 이메일 문자열로 합쳐준다.
 * emailDomain이 "direct"(직접 입력)인 경우, userEmail에 이미
 * "example@domain.com" 형태로 전체 이메일이 들어있다고 가정한다.
 */
function buildEmail(userEmail, emailDomain) {
  const trimmed = userEmail.trim();
  if (emailDomain === "direct" || trimmed.includes("@")) {
    return trimmed;
  }
  return `${trimmed}@${emailDomain}`;
}

/**
 * 회원가입: Supabase Auth로 계정을 만들고, profiles 테이블에 상세 정보를 이어서 저장한다.
 *
 * @param {Object} formData
 * @param {string} formData.userId       - 로그인 아이디 (profiles.user_login_id)
 * @param {string} formData.userPw       - 비밀번호
 * @param {string} formData.userEmail    - 이메일 아이디 부분 (혹은 direct 선택 시 전체 이메일)
 * @param {string} formData.emailDomain  - 이메일 도메인 select 값 ("direct" 포함)
 * @param {string} [formData.userName]
 * @param {string} [formData.birthDate]  - "YYYY-MM-DD"
 * @param {string} [formData.gender]     - "male" | "female" | "none"
 * @param {string[]} [formData.interests]
 * @param {string} [formData.joinPath]
 * @param {string} [formData.introduce]
 * @returns {Promise<{ success: boolean, userId?: string, error?: string }>}
 */
export async function signUp(formData) {
  const email = buildEmail(formData.userEmail, formData.emailDomain);

  // 1) Supabase Auth 계정 생성
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: formData.userPw,
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  const authUser = authData.user;
  if (!authUser) {
    // 이메일 확인(컨펌)이 켜져 있는 프로젝트라면 user는 오지만 session은 null일 수 있음.
    // user 자체가 없는 경우는 비정상 상황.
    return { success: false, error: "회원 정보를 생성하지 못했습니다." };
  }

  // 이메일 확인이 켜져 있으면 여기서 session이 null이다.
  // 세션(=로그인 상태)이 없으면 profiles insert 시 RLS(auth.uid() = id)를
  // 통과하지 못하므로, 미리 감지해서 정상적인 안내 메시지로 돌려준다.
  if (!authData.session) {
    return {
      success: false,
      error:
        "인증 메일을 보냈어요. 메일함에서 링크를 확인한 뒤 다시 로그인해주세요.",
      needsEmailConfirmation: true,
    };
  }

  // 2) profiles 테이블에 상세 정보 저장 (id를 auth 유저 id와 동일하게)
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authUser.id,
    user_login_id: formData.userId,
    user_name: formData.userName || null,
    birth_date: formData.birthDate || null,
    gender: formData.gender || "none",
    interests: formData.interests || [],
    join_path: formData.joinPath || null,
    introduce: formData.introduce || null,
  });

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  return { success: true, userId: authUser.id };
}

// ============================================================
// 2. 로그인 / 로그아웃
// ============================================================

/**
 * 로그인: 이메일 + 비밀번호로 Supabase Auth 세션을 생성한다.
 *
 * @param {Object} formData
 * @param {string} formData.userEmail    - 이메일 아이디 부분 (혹은 direct 선택 시 전체 이메일)
 * @param {string} formData.emailDomain  - 이메일 도메인 select 값 ("direct" 포함)
 * @param {string} formData.userPw       - 비밀번호
 * @returns {Promise<{ success: boolean, userId?: string, error?: string }>}
 */
export async function signIn(formData) {
  const email = buildEmail(formData.userEmail, formData.emailDomain);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: formData.userPw,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, userId: data.user?.id };
}

/**
 * 로그아웃: 저장된 Supabase 세션(로컬 인증 토큰)을 제거한다.
 *
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

// ============================================================
// 3. 로그인 여부 확인 (세션 토큰 기반)
// ============================================================

/**
 * 현재 로그인된 유저 정보를 반환한다. 로그인 안 되어 있으면 null.
 * supabase-js가 세션(토큰)을 알아서 관리하기 때문에,
 * 쿠키/토큰을 직접 파싱할 필요 없이 이 함수 하나로 로그인 여부를 판단하면 된다.
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

// ============================================================
// 4. 방명록 작성
// ============================================================

/**
 * 방명록 글 작성. 로그인한 사용자만 작성 가능 (RLS 정책과 동일한 조건).
 *
 * @param {string} content - 방명록 내용
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function addGuestbookEntry(content) {
  const trimmed = (content || "").trim();
  if (trimmed === "") {
    return { success: false, error: "내용을 입력해주세요." };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "로그인 후 작성할 수 있습니다." };
  }

  const { error } = await supabase.from("guestbook").insert({
    profile_id: user.id,
    content: trimmed,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================================
// 5. 방명록 목록 조회
// ============================================================

/**
 * 방명록 목록을 최신순으로 가져온다. (guestbook_list 뷰 사용)
 * 각 항목: { id, author(아이디), content, created_at_display("yyyy.mm.dd hh:mm") }
 *
 * @param {number} [limit] - 가져올 개수 (생략 시 전체)
 * @returns {Promise<{ success: boolean, list?: Array, error?: string }>}
 */
export async function getGuestbookList(limit) {
  let query = supabase
    .from("guestbook_list")
    .select("id, author, content, created_at_display");

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, list: data };
}
