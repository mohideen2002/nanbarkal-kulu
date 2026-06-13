"use client";
import Image from "next/image";
import styles from "../page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supaBaseClient";

export default function Chat() {

    const router = useRouter();

    const [message, setMessage] = useState("");
    const [user, setUser] = useState(""),
     [messages, setMessages] = useState([]);

 useEffect(() => {
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("id, created_at, message, user:users(id, name)")
      .order("id", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    setMessages([...data].reverse());
  };

  fetchMessages();

  const channel = supabase
    .channel("public:messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      async (payload) => {
        console.log("New message:", payload);

        const { data, error } = await supabase
          .from("messages")
          .select("id, created_at, message, user:users(id, name)")
          .eq("id", payload.new.id)
          .single();

        if (error) {
          console.error("Realtime fetch error:", error);
          return;
        }

        setMessages((prev) => [...prev, data]);
      }
    )
    .subscribe((status) => {
      console.log("Realtime Status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

    useEffect(() => {
      setUser(JSON.parse(localStorage.getItem("user")));
    },[])

    const logout = () => {
        localStorage.removeItem("user");
        router.push('/')
    }

    const sendMessage = async() => {
      if(message.length > 0){
       try {
        const resp = await supabase.from("messages").insert([{message,user_id:user.id}])
        if(resp.status === 200 || resp.status === 201){
          setMessage('');
        }
       } catch (error) {
       console.log("send message error" + error) 
       }
      }  
    }


  return (
    <div style={{height:"93.8vh"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",}}>
         <h3 style={{marginLeft:"20px",textAlign:"center",marginTop:"20px",}}>{user.name} ChatBox</h3>
         <button style={{marginRight:"10px",marginTop:"20px",backgroundColor:"white",color:"black",borderRadius:"20px",padding:"10px",width:"200px",fontSize:"20px"}} onClick={logout}>Logout</button>
      </div>

       <div style={{height:"80vh",overflowY:"scroll"}}>
        <ul style={{listStyle:"none"}}>
               {
                 messages.map((data , index) => {
           return(
               <li style={{backgroundColor:"white",color:"black",width:"25vh",marginTop:"10px",borderRadius:"5px",
                marginLeft:(data.user.id === user.id) ? "auto" : "10px" ,marginRight:(data.user.id != user.id) ? "auto" : "10px" ,
                paddingLeft:"10px" ,paddingRight:"10px" ,fontWeight:"bold"
                 }} key={data.id}><p style={{color:"blue"}}>{data.user.name}</p>{data.message}</li>
           )
        })  
               }
        </ul>
       </div>

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",}}>
        <input style={{ marginRight:"10px",borderRadius:"10px",padding:"10px"}} type="text" placeholder="type message..." value={message} onChange={(e) => setMessage(e.target.value)} />
        <button style={{marginRight:"10px",backgroundColor:"white",color:"black",borderRadius:"20px",padding:"10px",width:"200px",fontSize:"20px"}} disabled={message.length === 0} onClick={sendMessage}>Send</button>
    </div>


    </div>
  );
}
