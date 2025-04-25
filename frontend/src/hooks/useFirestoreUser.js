import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";
import { useEffect, useState } from 'react';

export function useFireStoreUser(user){
  const [userData, setUserData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchUserData = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid); 
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setUserData(snapshot.data()); 
      } else {
        console.warn('User document not found');
      }
      setIsLoading(false)
    };

    fetchUserData()
  },[user])


  return{
    userData,
    isLoading
  }
}
