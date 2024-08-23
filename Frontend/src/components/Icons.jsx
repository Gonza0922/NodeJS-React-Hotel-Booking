import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Password";
import CommentIcon from "@mui/icons-material/Comment";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const MySearchIcon = () => {
  return <SearchIcon className="search-icon" />;
};

export const MyPersonIcon = () => {
  return <PersonIcon className="dropdown-icon" />;
};

export const MyPasswordIcon = () => {
  return <PasswordIcon className="dropdown-icon" />;
};

export const MyCommentIcon = () => {
  return <CommentIcon className="dropdown-icon" />;
};

export const MyLogoutIcon = () => {
  return <LogoutIcon className="dropdown-icon" />;
};

export const MyDeleteOutlineIcon = () => {
  return <DeleteOutlineIcon color="error" className="toast-icon" />;
};
