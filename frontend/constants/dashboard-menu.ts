import {
   ChartColumnDecreasing,
   // ClipboardEdit,
   LayoutDashboard,
   ListPlus,
   LucideIcon,
   User,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface IMenuItem {
   logo: LucideIcon;
   link: keyof typeof ROUTES;
   title: string;
}

export const menuItems: IMenuItem[] = [
   {
      title: "Панель",
      logo: LayoutDashboard,
      link: "HOME",
   },
   {
      title: "Дисциплины",
      logo: ListPlus,
      link: "DISCIPLINES",
   },
   {
      title: "Категории",
      logo: ChartColumnDecreasing,
      link: "CATEGORIES",
   },
   /* {
      title: "Соревнования",
      logo: ClipboardEdit,
      link: "COMPETITIONS",
   }, */
   {
      title: "Пользователи",
      logo: User,
      link: "USERS",
   },
];
