import EmailVerification from "@/components/auth/email-verification";
import AuthLayout from "@/components/layout/auth-layout";
import Head from "next/head";

const EmailVerificationPage = () => {
  return (
    <AuthLayout>
      <Head>
        <title>パスワード設定 | Admin - K2 マニュアル</title>
      </Head>
      <EmailVerification />
    </AuthLayout>
  )
}
export default EmailVerificationPage;