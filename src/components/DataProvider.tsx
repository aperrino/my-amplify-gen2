import { useEffect, useState } from 'react';

// Define the type for the items that will be loaded
type ItemType = any; // Replace `any` with the actual type of the items

// Define the type for the loadCallback function
type LoadCallback = () => Promise<ItemType[]>;

// Define the return type of the hook
type UseAsyncDataReturnType = [ItemType[], React.Dispatch<React.SetStateAction<ItemType[]>>, boolean];

export function useAsyncData(loadCallback: LoadCallback): UseAsyncDataReturnType {
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let rendered = true;
  
    const loadItems = async () => {
      try {
        const items = await loadCallback();
        if (rendered) {
          setItems(items);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading items:', error);
        setLoading(false);
      }
    };
  
    loadItems();
  
    return () => {
      rendered = false;
    };
  }, [loadCallback]);  

  return [items, setItems, loading];
}