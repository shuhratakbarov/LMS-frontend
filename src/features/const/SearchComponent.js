import { useEffect, useRef, useState } from "react";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

const SearchComponent = ({ placeholder, handleSearch, loading }) => {
  const searchRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onSearch = (value) => {
    handleSearch(value);
    setSearchValue(value);
  };

  const onClear = () => {
    setSearchValue('');
    handleSearch('');
  };

  return (
    <Search
      ref={searchRef}
      placeholder={placeholder}
      onSearch={onSearch}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      enterButton={
        <Button type="primary" icon={<SearchOutlined />} loading={loading}>
          Search
        </Button>
      }
      allowClear
      onClear={onClear}
      style={{ width: 320 }}
      size="middle"
    />
  );
};

export default SearchComponent;