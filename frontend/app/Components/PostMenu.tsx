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
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
        {isOwner && (
          <TouchableOpacity onPress={onDelete} style={styles.menuItem}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onShare} style={styles.menuItem}>
          <Text style={styles.shareText}>Share</Text>
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
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 2,
  },
  editText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FF3B30",
  },
  shareText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});

export default PostMenu;
