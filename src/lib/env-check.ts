/**
 * 필수 환경 변수 목록
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

/**
 * 환경 변수 유효성 검사
 * 빌드 타임 또는 런타임 초기에 호출하여 누락된 설정을 확인합니다.
 */
export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

  if (missing.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Critical: Missing required environment variables: ${missing.join(', ')}. ` +
        `Please check your Vercel Project Settings.`
      );
    } else {
      console.warn(
        `Warning: Missing environment variables: ${missing.join(', ')}. ` +
        `Firebase functionality might be limited.`
      );
    }
  } else {
    console.log('✅ All required environment variables are set.');
  }
}
