import { useState, useCallback } from 'react';
import axiosInstance from "./host";
import axios from "axios";

const useFetch = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (url, options = {}) => {
        setLoading(true);
        const source = axios.CancelToken.source(); // Create a new CancelToken source

        try {
            const response = await axiosInstance({
                url,
                cancelToken: source.token,
                ...options,
            });
            setData(response.data);
            setError(null);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                setError(error.message);
            }
            setData(null);
        } finally {
            setLoading(false);
        }

        return () => {
            source.cancel('Operation canceled by the user.');
        };
    }, []);

    return { data, error, loading, fetchData };
};

export default useFetch;
