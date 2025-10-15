import { Layout, Input, Select, Typography, Spin } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ConversationList from "./ConversationList";
import SearchResults from "./SearchResults";

const { Sider } = Layout;
const { Title } = Typography;

const ConversationSidebar = ({
                                 currentUser, searchTerm, onSearchChange, showTypeToggle, setShowTypeToggle,
                                 searchType, setSearchType, conversationsLoading, searchMode,
                                 filteredLocalMatches, filteredGlobalMatches, onlineUsernames,
                                 onSearchResultClick, filteredConversations, selectedConversation,
                                 onConversationSelect, typingByConversation, isMobile
                             }) => {
    const SidebarContent = () => (
        <>
            <div style={{ padding: isMobile ? "12px" : "0 16px" }}>
                <Title level={isMobile ? 5 : 4}>
                    <MessageOutlined /> Messages
                </Title>

                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={onSearchChange}
                        onFocus={() => setShowTypeToggle(true)}
                        onBlur={() => setShowTypeToggle(false)}
                        size={isMobile ? "middle" : "default"}
                    />
                    {showTypeToggle && (
                        <Select
                            value={searchType}
                            onChange={setSearchType}
                            onClick={() => setShowTypeToggle(true)}
                            onBlur={() => setShowTypeToggle(false)}
                            style={{ width: isMobile ? 90 : 110 }}
                            size={isMobile ? "middle" : "default"}
                            options={[
                                { value: "user", label: "User" },
                                { value: "group", label: "Group" }
                            ]}
                        />
                    )}
                </div>
            </div>

            {conversationsLoading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <Spin size="large" />
                </div>
            ) : searchMode ? (
                <SearchResults
                    localMatches={filteredLocalMatches}
                    globalMatches={filteredGlobalMatches}
                    onlineUsernames={onlineUsernames}
                    onResultClick={onSearchResultClick}
                    isMobile={isMobile}
                />
            ) : (
                <ConversationList
                    currentUser={currentUser}
                    conversations={filteredConversations}
                    selectedConversation={selectedConversation}
                    onlineUsernames={onlineUsernames}
                    onSelect={onConversationSelect}
                    typingByConversation={typingByConversation}
                    isMobile={isMobile}
                />
            )}
        </>
    );

    if (isMobile) {
        return <SidebarContent />;
    }

    return (
        <Sider width={300} style={{ background: "#fff", borderRight: "1px solid #f0f0f0", overflow: "auto" }}>
            <SidebarContent />
        </Sider>
    );
};

export default ConversationSidebar;