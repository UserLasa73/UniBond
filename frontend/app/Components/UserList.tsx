import { View, Text } from "react-native";

const UserList = ({ user }) => {
  return (
    <View
      style={{
        padding: 15,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontWeight: "bold" }}>{user.full_name}</Text>
    </View>
  );
};
export default UserList;
