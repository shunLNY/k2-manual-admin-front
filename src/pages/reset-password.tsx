import NewPassword from "@/components/auth/new-password"
import AuthLayout from "@/components/layout/auth-layout";
import Head from 'next/head';

const NewPasswordPage = () => {
  return (
    <AuthLayout>
      <Head>
        <title>再設定リンク送信 | Admin - K2 マニュアル</title>
      </Head>
      <NewPassword />
    </AuthLayout>
  )
}
export default NewPasswordPage