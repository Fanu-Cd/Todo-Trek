import { Outlet } from "react-router-dom";
export default function Layout() {
    return (
      <>
          <h5 className="pt-3 text-center" style={{color:"darkslategray"}}>TodoTrek</h5>
        <Outlet />
      </>
    );
  }