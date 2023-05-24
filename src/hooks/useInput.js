import { useState, useCallback } from "react"

const useInput = (initialData) => {
    const [data, setData] = useState(initialData)

    const onChange = useCallback((e) => {
        const value = e.target.value;
        setData(value)
    }, []);

    const reset = useCallback(()=> setData(initialData))
    
    return [data, onChange, reset]
}

export default useInput;
