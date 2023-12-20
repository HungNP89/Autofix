import { authContext } from "../Helpers/AuthContext";
import { useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Layout,
  Menu,
  theme,
  Calendar,
  Modal,
  Tooltip,
  Popover,
} from "antd";
import "../Design/MainPage.css";
import {
  CalendarOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import BookingForm from "./BookingForm";
function MainPage() {
  const { Content, Sider } = Layout;

  const { setAuthData } = useContext(authContext);
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [value, setValue] = useState(() => dayjs(new Date()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [notice, setNotice] = useState([]);
  const [disabled, setDisabled] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [firstLetter, setFirstLetter] = useState("");

  useEffect(() => {
    const getToken = Cookies.get("authToken");
    if (getToken) {
      const decodedToken = JSON.parse(atob(getToken.split(".")[1]));
      const Id = decodedToken._id;
      const name = decodedToken.username || decodedToken.name;
      const firstLetter = name.charAt(0).toUpperCase();
      setUserId(Id);
      setUserName(name);
      setFirstLetter(firstLetter);
    }
  }, [setUserId, setUserName, setFirstLetter]);

  const showPopup = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSelect = (newValue, { source }) => {
    if (source === "date") {
      setValue(newValue);
      setSelectedDate(newValue);
      showPopup();
    }
  };

  const onPanelChange = (newValue) => {
    setValue(newValue);
  };

  const handleLogOut = () => {
    Cookies.remove("authToken");
    setAuthData(null);
    navigate("/");
  };

  const items = [
    {
      label: <Link to="/main">Calendar</Link>,
      icon: <CalendarOutlined />,
      key: "main",
    },
    {
      label: <Link to="/main/detail">My Bookings</Link>,
      icon: <BarsOutlined />,
      key: "detail",
    },
  ];

  const fetchData = async () => {
    const month = dayjs().month();
    try {
      const response = await fetch(
        `https://autofix-server.onrender.com/booking/all?month=${month}`
      );
      if (response.ok) {
        const data = await response.json();  
        const { bookings, unAvailableDate } = data;
        const disableArray = unAvailableDate.map((date) => {
          const unAvailableDay = unAvailableDate.find(
            (day) => day.dateId === date.dateId
          );

          return unAvailableDay;
        });
        const userBookings = bookings.all.filter(
          (booking) =>
            (booking.user_id.length > 0 && booking.user_id[0]._id === userId) && booking.status !== 4 && booking.status !== 3 ||
            (booking.user_google_id.length > 0 &&
              booking.user_google_id[0]._id === userId && booking.status !== 4 && booking.status !==3)
        );
        
        setDisabled(disableArray);
        setNotice(userBookings);
      } else {
        console.error("Fetching data failed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchData(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");

    const noticeNote = notice.filter((notices) => {
      const noticeDate = dayjs(notices.date).format("YYYY-MM-DD");
      return noticeDate === formattedDate;
    });

    return (
      <div style={{ fontSize: 14 }}>
        {noticeNote.map((notice, index) => (
          <div key={notice._id} style={{ marginBottom: 10, marginLeft: 10 }}>
            <div> {index + 1}.</div>
            <div> Employee: {notice.employee_id[0].employee_name}</div>
            <div>Hours: {notice.hours_id[0].hours}</div>
          </div>
        ))}
      </div>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  const disabledDate = (current) => {
    const formattedDate = current.format("YYYY-MM-DD");
    const isDateDisabled = disabled.some(
      (date) => date.dateId === formattedDate && date.unAvailableDates
    );

    return isDateDisabled || current < dayjs().startOf("day");
  };

  const confirmLogOut = () => {
    Modal.confirm({
      title: "Do you want to log out?",
      icon: <ExclamationCircleOutlined />,
      content: "If agree, please choose OK or Cancel if you change your mind.",
      onOk: () => {
        handleLogOut();
      },
      onCancel: () => {},
    });
  };

  const content = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button type="primary" className="logout-btn" onClick={confirmLogOut}>
        <LogoutOutlined /> Log Out
      </Button>
    </div>
  );
  return (
    <div className="main-page">
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          {!collapsed && <div className="logo1">AUTOFIX</div>}
          <Menu
            style={{ marginTop: "50px" }}
            theme="dark"
            defaultSelectedKeys={["main"]}
            mode="inline"
            items={items}
          ></Menu>
        </Sider>
        <Layout>
          <Content
            style={{
              margin: "0 16px",
              marginTop: "15px",
            }}
          >
            <div className="content-header">
              <Breadcrumb
                className="breadcrumbs"
                items={[
                  { title: "Welcome" },
                  {
                    title: (
                      <Tooltip title={userName}>
                        <div className="tooltip">{userName}</div>
                      </Tooltip>
                    ),
                  },
                ]}
              />
              <Popover
                content={content}
                title={
                  <span style={{ display: "flex", justifyContent: "center" }}>
                    Manage Account
                  </span>
                }
                overlayStyle={{ maxWidth: 300 }}
              >
                <Button className="user-icon">{firstLetter}</Button>
              </Popover>
            </div>
            <div className="notice">
              <div className="square1">
              </div>
              <div>: Disabled Date  /</div>
              <div className="square2"></div>
              <div>: Available Date</div>
            </div>
            <div
              style={{
                padding: 24,
                marginTop: "10px",
                boxSizing: "unset",
                minHeight: "90vh",
                background: colorBgContainer,
              }}
            >
              <Calendar
                value={value}
                onSelect={onSelect}
                disabledDate={disabledDate}
                onPanelChange={onPanelChange}
                cellRender={cellRender}
              ></Calendar>
              <Modal
                width={900}
                title={<span style={{ fontSize: "30px" }}>Booking Form</span>}
                destroyOnClose={true}
                open={isModalOpen}
                keyboard={true}
                centered
                onOk={handleOk}
                onCancel={handleCancel}
                cancelButtonProps={{ style: { display: "none" } }}
                okButtonProps={{ style: { display: "none" } }}
              >
                <BookingForm selectedDate={selectedDate} userId={userId} />
              </Modal>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default MainPage;
