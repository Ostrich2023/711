import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import LanguageSwitcher from "../LanguageSwitcher";// 新增导入
import classes from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={classes.wrapper}>
      <div className={classes.headerBar}>
        <Header />
        <div className={classes.langSwitch}>
          <LanguageSwitcher />
        </div>
      </div>

      <main className={classes.content}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
