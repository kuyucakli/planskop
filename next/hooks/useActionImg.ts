import { getActionPhoto } from "@/db/queries";
import { useEffect, useState, useTransition } from "react";

const useActionImg = (actionId:string)=>{
    const [isPending, startTransition] = useTransition();
  const [path, setPath] = useState<null | string>(null);


  useEffect( ()=>{
    
      startTransition(async()=>{
          const res = await getActionPhoto(actionId);
          setPath(res ? res[0]?.imageUrl : null);
      });
    
  }, [actionId]); 

  return { isPending, path };
}



export { useActionImg };