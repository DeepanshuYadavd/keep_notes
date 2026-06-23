import LightbulbIcon from "@mui/icons-material/LightbulbOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import ArchiveIcon from "@mui/icons-material/ArchiveOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

export const GetNavigation = () => [
  {
    segment: "",
    title: "Notes",
    icon: <LightbulbIcon />,
  },
  {
    segment: "reminders",
    title: "Reminders",
    icon: <NotificationsIcon />,
  },
  {
    kind: "divider",
  },
  {
    segment: "archive",
    title: "Archive",
    icon: <ArchiveIcon />,
  },
  {
    segment: "trash",
    title: "Trash",
    icon: <DeleteIcon />,
  },
];
