import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  IconButton,
  Divider,
  Button,
  Modal,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import {
  Home,
  Chat,
  Settings,
  Person,
  Send,
  Mic,
  Image,
  MoreVert,
  Call,
  Videocam,
  Search,
} from "@mui/icons-material";
import {
  // useDataExceptLoggedInuserQuery,
  useGetUserListQuery,
} from "../../services/userList";
import styles from "./ChatApp.module.css";
import {
  useCreateGroupMutation,
  useGetGroupListQuery,
  useGetGroupMessagesQuery,
} from "../../services/groupList";
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
} from "../../services/userMessages";
import { skipToken } from "@reduxjs/toolkit/query";

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [userid, setUserId] = useState<number | null>(null);

  const { data } = useGetUserListQuery();
  const userList = data?.data;

  const { data: groupList } = useGetGroupListQuery();
  const groupListData = groupList?.data;

  const [CreateMessage] = useCreateMessageMutation();

  // Fetch User Messages
  const { data: chatMessages } = useGetMessagesQuery(
    userid !== null && selectedChat !== null
      ? { sendid: userid, revid: selectedChat }
      : skipToken
  );

  // Fetch Group Messages
  const { data: groupMessages } = useGetGroupMessagesQuery(
    selectedGroup !== null ? selectedGroup : skipToken
  );
  const filterGroupMessages = groupMessages?.data;
  const groupChatMessages = filterGroupMessages?.[0].messages;

  const allChatMessages = selectedGroup
    ? groupChatMessages
    : chatMessages?.data;

  React.useEffect(() => {
    const storedId = Number(localStorage.getItem("id"));
    if (!isNaN(storedId)) {
      setUserId(storedId);
    }
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || userid === null || (!selectedChat && !selectedGroup))
      return;

    const data = {
      content: message,
      userId: userid,
      receiverId: selectedChat,
    };
  };

  const handleSelectUser = (userId: number) => {
    setSelectedChat(userId);
    setSelectedGroup(null); // Deselect any selected group
  };

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroup(groupId);
    setSelectedChat(null); // Deselect any selected user
  };

  
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const [groupType, setGroupType] = useState("public"); // Default selection
  
  // const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  // name : string,
  // type: string,
  // adminId : number,
  const [createGroup] = useCreateGroupMutation();

  const creategroup = async () => {
    try {
      const data = { name: groupName, type: groupType, adminId: userid };
      const response = await createGroup(data).unwrap(); 
      console.log("Group Created:", response);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating group:", error);
      setOpenModal(false);
    }
  };

  return (
    <Grid container className={styles.container}>
      {/* Sidebar */}
      <Grid item xs={0.8} className={styles.sidebar}>
        <Avatar src="https://i.pravatar.cc/100" className={styles.profile} />
        <Grid>
          <IconButton className={styles.iconsButton}>
            <Home />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <Settings />
          </IconButton>
          <IconButton>
            <Person />
          </IconButton>
        </Grid>
      </Grid>

      {/* Contacts Section */}
      <Grid item xs={3} className={styles.contacts}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search"
          size="small"
        />

        <Typography variant="h6">Groups</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Create Group
        </Button>

        <List>
          {groupListData &&
            groupListData.map((group) => (
              <ListItem
                key={group.id}
                button
                onClick={() => handleSelectGroup(group.id)}
              >
                <ListItemText primary={group.name} secondary={group.type} />
              </ListItem>
            ))}
        </List>

        <Typography variant="h6">People</Typography>
        <List className={styles.peopleList}>
          {userList &&
            userList.map((person) => (
              <ListItem
                key={person.id}
                button
                onClick={() => handleSelectUser(person.id)}
              >
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText primary={person.name} />
              </ListItem>
            ))}
        </List>
      </Grid>

      {/* Chat Box */}
      <Grid item xs={8.2} className={styles.chatbox}>
        {selectedChat || selectedGroup ? (
          <>
            {/* Chat Header */}
            <Paper elevation={3} className={styles.chatHeader}>
              <Avatar />
              <Typography variant="h6">
                {selectedChat
                  ? userList?.find((user) => user.id === selectedChat)?.name
                  : selectedGroup
                  ? groupListData?.find((group) => group.id === selectedGroup)
                      ?.name
                  : ""}
              </Typography>
              <Box>
                <IconButton>
                  <Call />
                </IconButton>
                <IconButton>
                  <Videocam />
                </IconButton>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
            </Paper>

            {/* Chat Messages */}
            <Box className={styles.messages}>
              {allChatMessages &&
                allChatMessages.map((msg, index) => (
                  <Typography
                    key={index}
                    className={
                      msg.userId === userid || msg.groupId === selectedGroup
                        ? styles.myMessage
                        : styles.otherMessage
                    }
                  >
                    {msg.content}
                  </Typography>
                ))}
            </Box>

            {/* Chat Input */}
            <Paper className={styles.chatInput}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <IconButton>
                <Image />
              </IconButton>
              <IconButton>
                <Mic />
              </IconButton>
              <IconButton onClick={sendMessage}>
                <Send />
              </IconButton>
            </Paper>
          </>
        ) : (
          <Typography variant="h6" className={styles.noChat}>
            Select a chat to start messaging
          </Typography>
        )}
      </Grid>

      {/* Create Group Modal */}
      <Modal open={openModal} onClose={handleClose}>
        <Box className={styles.modalBox}>
          <Typography variant="h6">Create New Group</Typography>
          <TextField
            fullWidth
            label="Group Name"
            variant="outlined"
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <FormControl component="fieldset" className={styles.radioGroup}>
            <FormLabel component="legend">Group Type</FormLabel>
            <RadioGroup
              row
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
            >
              <FormControlLabel
                value="public"
                control={<Radio />}
                label="Public"
              />
              <FormControlLabel
                value="private"
                control={<Radio />}
                label="Private"
              />
            </RadioGroup>
          </FormControl>
          <Box className={styles.button}>
            <Button
              variant="contained"
              color="primary"
              onClick={creategroup}
            >
              Create
            </Button>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default ChatApp;
