import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebaseClient';
import { doc, getDoc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useAppStore } from '../state/store';

type CoupleData = {
  id: string;
  user1_id: string;
  user2_id: string;
  trust_meter: number;
  vulnerability_meter: number;
  romance_meter: number;
  connection_meter: number;
  total_points: number;
  streak_days: number;
  last_interaction: Timestamp | null;
};

export const usePartnerPresence = () => {
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const user_id = useAppStore(state => state.user_id);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const checkCoupleStatus = async () => {
      setLoading(true);
      
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get user's profile to find couple_id
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists() && profileSnap.data()?.couple_id) {
          const coupleId = profileSnap.data().couple_id;
          
          // Listen for changes to couple data
          const coupleRef = doc(db, 'couples', coupleId);
          unsubscribe = onSnapshot(coupleRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data() as CoupleData;
              setCoupleData({
                ...data,
                id: doc.id
              });
              
              // Calculate if partner is online (active in last 5 minutes)
              if (data.last_interaction) {
                const fiveMinutesAgo = new Date();
                fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
                
                if (data.last_interaction.toDate() > fiveMinutesAgo) {
                  setPartnerOnline(true);
                } else {
                  setPartnerOnline(false);
                }
              }
              
              setIsConnected(true);
            }
          });
        }
      } catch (error) {
        console.error("Error checking couple status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCoupleStatus();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const updateCoupleMetrics = async (metrics: Partial<CoupleData>) => {
    if (!coupleData) return false;
    
    try {
      const coupleRef = doc(db, 'couples', coupleData.id);
      await updateDoc(coupleRef, {
        ...metrics,
        last_interaction: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error("Error updating couple metrics:", error);
      return false;
    }
  };

  return {
    coupleData,
    isConnected,
    partnerOnline,
    loading,
    updateCoupleMetrics
  };
};