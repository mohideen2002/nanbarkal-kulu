"use client";

import { supabase } from "@/lib/supaBaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function Home() {

  const [name , setName] = useState("");
  const [phone , setPhone] = useState("");
  const [errorText , setErrorText] = useState("");

  const router = useRouter();



  const userLogin = async() => {
    setErrorText("")
    if(name.length < 5){
       setErrorText("name must be contain five letters")
    }else if(phone.length != 10){
       setErrorText("phone number must be 10 numbers plese check")
    }else{
      try {
        const resp = await supabase.from("users").insert([{name,phone_number : phone}]);
        console.log("resp",resp)

        if(resp.status === 201 || resp.status === 200){
          setName("")
         router.push('/');
        }else{
          setErrorText("login unsuccessful")
        }
        
      } catch (error) {
        console.log("user catch error" + error)
      }

    }
  }

  return (
    <div style={{height:"93.8vh"}}>
     
     <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"90vh"}}>
     <h3 style={{textAlign:"center",marginBottom:"30px",}}>REGISTER</h3>
     
     <input style={{padding:"10px",marginBottom:"10px",borderRadius:"10px"}} placeholder="enter your name" type="text" value={name} onChange={(e) => setName(e.target.value)} /> 
     <input style={{padding:"10px",borderRadius:"10px"}} placeholder="enter your phone number" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} /> 
     {errorText ? <h3 style={{marginTop:"10px"}}>{errorText}</h3> :""}

     <button style={{marginTop:"20px",backgroundColor:"white",color:"black",borderRadius:"20px",padding:"10px",width:"200px",fontSize:"20px"}} 
     onClick={userLogin}>Register</button>
     <p style={{marginTop:"5px"}}>Do you have account please  <Link style={{color:"blue",textDecoration:"underline"}} href='/'>Login here</Link></p>
     </div>
     <p style={{textAlign:"center"}}>created by nowfa</p>

    </div>
  );
}
