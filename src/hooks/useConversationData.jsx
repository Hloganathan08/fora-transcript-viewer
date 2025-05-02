import { useEffect, useState } from 'react';

export function useConversationData() {
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      async function loadConversation() {
        try {
          const res = await fetch('/conversation.json');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          setConversation(data);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
  
      loadConversation();
    }, []);
  
    return { conversation, loading, error };
  }