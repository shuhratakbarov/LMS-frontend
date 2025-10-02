import { List, Avatar, Badge, Typography } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { RoleIcon } from "../../utils/util";
import { formatLastSeen } from "../../utils/FormatDate";

const { Text } = Typography;

const SearchResults = ({
                         localMatches,
                         globalMatches,
                         onlineUsernames,
                         onResultClick
                       }) => {
  const dataSource = [
    ...(localMatches.length > 0
      ? [{ section: "local" }, ...localMatches]
      : []),
    ...(globalMatches.length > 0
      ? [{ section: "global" }, ...globalMatches]
      : [])
  ];

  return (
    <List
      dataSource={dataSource}
      renderItem={(item) => {
        if (item.section === "local") {
          return (
            <List.Item style={{
              padding: '12px 16px',
              backgroundColor: '#fafafa',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <Text strong>Your Conversations</Text>
            </List.Item>
          );
        }

        if (item.section === "global") {
          return (
            <List.Item style={{
              padding: '12px 16px',
              backgroundColor: '#fafafa',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <Text strong>Global Search</Text>
            </List.Item>
          );
        }

        const isOnline = !item.isGroup && onlineUsernames.includes(item.username);
        const isLocalMatch = localMatches.includes(item);

        return (
          <List.Item
            onClick={() => onResultClick(item)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer'
            }}
            extra={
              isLocalMatch && item.unreadCount > 0 && (
                <Badge count={item.unreadCount} />
              )
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{ backgroundColor: "#949494", fontSize: 30 }}
                  icon={!item.isGroup ? <RoleIcon role={item.role} /> : <TeamOutlined />}
                  size={48}
                >
                  {item.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              }
              title={item.name}
              description={
                isLocalMatch ? (
                  isOnline ? (
                    <span style={{ color: '#1677ff' }}>Online</span>
                  ) : (
                    item.lastSeen
                      ? `${formatLastSeen(item.lastSeen)}`
                      : "Offline"
                  )
                ) : (
                  !item.isGroup
                    ? `${item.role.charAt(0).toUpperCase() + item.role.slice(1).toLowerCase()}: @${item.username}`
                    : `Group: @${item.username}`
                )
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default SearchResults;