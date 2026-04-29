import MainLayout from "@/components/layout/main-layout";
import Head from "next/head";
import { ReactElement } from "react";

import DashBoardPage from "./dashboard";
 
 
export default function Page() {
  return (
    <>
      <Head>
        <title>Admin - K2 マニュアル</title>
      </Head>
      <DashBoardPage></DashBoardPage>

    </>
  );
}
 
Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout title="Admin - K2 マニュアル">{page}</MainLayout>
  )
}