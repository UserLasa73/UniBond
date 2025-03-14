import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useEffect } from "react";

const PostMenu = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  onShare,
  isOwner,
  position,
}) => {
  useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          onClose();
          return true;
        }
      );
      return () => backHandler.remove();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      {/* Click outside to close */}
      <TouchableOpacity style={styles.overlay} onPress={onClose} />

      {/* Menu container positioned correctly */}
      <View
        style={[styles.menuContainer, { top: position.y, left: position.x }]}
      >
        {isOwner && (
          <TouchableOpacity onPress={onEdit} style={styles.menuItem}>
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
        )}
        {isOwner && (
          <TouchableOpacity onPress={onDelete} style={styles.menuItem}>
            <Text style={styles.menuText}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onShare} style={styles.menuItem}>
          <Text style={styles.menuText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PostMenu;
