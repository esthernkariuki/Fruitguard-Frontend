import Image from "next/image";

import Register from "./Register/page";
import Login from "./Login/page";

export default function Home() {
  return (
    <div>
      <Register/>
      <Login/>
    </div>
  );
}
