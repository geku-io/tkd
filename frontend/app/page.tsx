import type { Metadata } from "next";
import MainPage from "../components/screens/main/MainPage";

export const metadata: Metadata = {
   title: "Расписание соревнование ТКД по тхэквондо",
   description:
      "Удобный способ посмотреть расписание соревнований по тхэквондо",
};

export default function Home() {
   return (
      <div className="max-w-[1440px] px-4 py-10 mx-auto">
         <MainPage />
      </div>
   );
}
