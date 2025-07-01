"use client";

import { supabase } from "@/lib/supaBaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function Home() {

  const [phone , setPhone] = useState("");
  const [errorText , setErrorText] = useState("");

  const router = useRouter();



  const userLogin = async() => {
    if(phone.length != 10){
      setErrorText("phone number must be 10 numbers plese check")
    }else {
      try {
        const resp = await supabase.from('users').select('id,name,phone_number').eq('phone_number' , phone);

        console.log('resp',resp)
        console.log('resp',resp.data)
        console.log('resp',resp.data.length)
        console.log('resp',resp.data[0])

        if (resp.status === 200 && resp.data.length > 0){
          localStorage.setItem('user',JSON.stringify(resp.data[0]));
          router.push("/Chat")
        }else{
          setErrorText("phone number didn't register yet please register and try login")
        }
        
      } catch (error) {
        console.log("login error" + error)
      }
    }
   
  }

  return (
    <div style={{height:"93.8vh"}}>
     
     <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"90vh"}}>
     <h3 style={{textAlign:"center",marginBottom:"30px",}}>உள்ள வாங்க நண்பர்களே</h3>
     
     <input style={{padding:"10px"}} placeholder="enter your mobile number" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} /> 
     {errorText ? <h3 style={{marginBottom:"20px"}}>{errorText}</h3> :""}
     <button style={{marginTop:"20px",backgroundColor:"white",color:"black",borderRadius:"20px",padding:"10px",width:"200px",fontSize:"20px"}} 
     onClick={userLogin}>LogIn</button>
     <p style={{marginTop:"5px"}}>Dont have account please  <Link style={{color:"blue",textDecoration:"underline"}} href='/register'>Register here</Link></p>
     </div>
     <p style={{textAlign:"center"}}>created by nowfa</p>

    </div>
  );
}
