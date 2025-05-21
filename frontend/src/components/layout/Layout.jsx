import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import classes from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={classes.wrapper}>
      <div className={classes.headerBar}>
        <Header />
      </div>

      <main className={classes.content}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
