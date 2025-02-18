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
import { useGetUserListQuery } from "../../services/userList";
import styles from "./ChatApp.module.css";
import { useGetGroupListQuery } from "../../services/groupList";

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");

  const { data } = useGetUserListQuery();
  const { data: groupList } = useGetGroupListQuery()
  const userList = data?.data;
  const groupListData = groupList?.data;


  const messages = [
    { sender: "other", text: "Hey There!", time: "8:30pm" },
    { sender: "other", text: "How are you?", time: "8:30pm" },
    { sender: "me", text: "Hello!", time: "8:33pm" },
    { sender: "me", text: "I am fine and how are you?", time: "8:34pm" },
    {
      sender: "other",
      text: "I am doing well, Can we meet tomorrow?",
      time: "8:36pm",
    },
    { sender: "me", text: "Yes Sure!", time: "8:58pm" },
  ];

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
        <List>
          {groupListData && groupListData.map((group, index) => (
            <ListItem key={index} button>
              <ListItemText primary={group.name} secondary={group.type} />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6">People</Typography>
        <List className={styles.peopleList}>
          {userList && userList.map((person, index) => (
            <ListItem
              key={index}
              button
              onClick={() => setSelectedChat(person)}
            >
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary={person.name}
                secondary={person.lastMessage}
              />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Chat Box */}
      <Grid item xs={8.2} className={styles.chatbox}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <Paper elevation={3} className={styles.chatHeader}>
              <Avatar />
              <Typography variant="h6">{selectedChat.name}</Typography>
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
              {messages.map((msg, index) => (
                <Typography
                  key={index}
                  className={
                    msg.sender === "me" ? styles.myMessage : styles.otherMessage
                  }
                >
                  {msg.text} <span className={styles.time}>{msg.time}</span>
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
              <IconButton>
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
    </Grid>
  );
};

export default ChatApp;
