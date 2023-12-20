import { useNavigate, Link } from "react-router-dom";
import { authContext } from "../Helpers/AuthContext";
import { useContext, useState, useEffect , lazy} from "react";
import Cookies from "js-cookie";
import {
  Button,
  Layout,
  Menu,
  theme,
  Breadcrumb,
  Tooltip,
  Table,
  Pagination,
  Modal,
  Popover,
} from "antd";
import {
  HistoryOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  LogoutOutlined,
  BarsOutlined,
  StarOutlined,
  // StarOutlined,
} from "@ant-design/icons";
import "../Design/BookingHistory.css";
import dayjs from "dayjs";
const RatingForm = lazy(() => import("./RatingForm"));

function BookingHistory() {
  const { Content, Sider } = Layout;
  const { setAuthData } = useContext(authContext);
  const [booking, setBooking] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(false);
  const postPerPage = 10;
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [firstLetter, setFirstLetter] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = Cookies.get("authToken");
    if (getToken) {
      const decodedToken = JSON.parse(atob(getToken.split(".")[1]));
      console.log(decodedToken);
      const Id = decodedToken._id;
      const name = decodedToken.username || decodedToken.name;
      const firstLetter = name.charAt(0).toUpperCase();
      setFirstLetter(firstLetter);
      setUserId(Id);
      setUserName(name);
    }
  }, [setUserId, setUserName, setFirstLetter]);

  const handleLogOut = () => {
    Cookies.remove("authToken");
    setAuthData(null);
    navigate("/");
  };

  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };

  const handleData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://autofix-server.onrender.com/booking/all?id=${userId}&currentPage=${currentPage}&limit=${postPerPage}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const filterBooking = data.bookings34.filter(
          (booking) => booking.status === 3 || booking.status === 4
        );

        console.log(filterBooking);
        setTimeout(() => {
          setLoading(false);
          setBooking(filterBooking);
          setTotalBookings(data.totalBookings34);
        }, 2000);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      handleData(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, userId]);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showPopup = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const buttonFinish = (record) => {
    const mechanicId = record.status === 3 ? record.employee_id[0]._id : null;
    if (mechanicId) {
      setEmployeeID(mechanicId);
      setAvatar(record.employee_id[0].avatar);
      setEmployeeName(record.employee_id[0].employee_name);
      setSelectedBookingId(record._id);
      showPopup();
    } else {
      console.error("Mechanic ID not found.");
    }
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
    {
      label: <Link to="/main/history">History</Link>,
      icon: <HistoryOutlined />,
      key: "history",
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) =>
        (currentPage - 1) * postPerPage + index + 1,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date, record) => formatDate(record.date),
    },
    {
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
      render: (text, record) => record.hours_id[0].hours,
    },
    {
      title: "Mechanic",
      dataIndex: "employee",
      key: "employee",
      render: (text, record) => record.employee_id[0].employee_name,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 3 ? "Finished" : "Cancelled"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          {record.status === 3 && !record.isRating ? (
            <Button
              onClick={() => buttonFinish(record)}
              disabled={record.isRating}
            >
              <StarOutlined />
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

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
    <div>
      <Button type="primary" className="logout-btn" onClick={confirmLogOut}>
        <LogoutOutlined /> Log Out
      </Button>
    </div>
  );
  return (
    <div className="booking-page">
      <Layout>
        <Sider
          style={{}}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          {!collapsed && (
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "center",
              }}
            >
              AUTOFIX
            </div>
          )}
          <Menu
            style={{ marginTop: "50px" }}
            theme="dark"
            defaultSelectedKeys={["history"]}
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Breadcrumb
                style={{
                  width: "200px",
                  color: "black",
                  fontSize: 15,
                }}
                items={[
                  { title: "Welcome" },
                  {
                    title: (
                      <Tooltip title={userName}>
                        <div
                          style={{
                            maxWidth: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {userName}
                        </div>
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
              >
                <Button
                  style={{
                    width: "35px",
                    borderRadius: 120,
                    height: 35,
                    color: "white",
                    fontSize: 15,
                    backgroundColor: "#1677ff",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {firstLetter}
                </Button>
              </Popover>
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
              <Table
                dataSource={booking}
                columns={columns}
                rowKey={(record) => record._id}
                pagination={false}
                loading={loading}
              />
              <Modal
                width={500}
                title={
                  <span
                    style={{
                      fontSize: "20px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Rating Mechanic
                  </span>
                }
                destroyOnClose={true}
                open={isModalOpen}
                keyboard={true}
                centered
                onOk={handleOk}
                onCancel={handleCancel}
                closeIcon={false}
                cancelButtonProps={{ style: { display: "none" } }}
                okButtonProps={{ style: { display: "none" } }}
              >
                <RatingForm
                  employeeID={employeeID}
                  avatar={avatar}
                  employeeName={employeeName}
                  onRatingSubmit={() => {
                    handleOk();
                    handleData();
                  }}
                  bookingId={selectedBookingId}
                />
              </Modal>
              {(currentPage !== 1 || booking.length > 1) && (
                <Pagination
                  style={{ marginTop: 30 }}
                  defaultCurrent={1}
                  onChange={handlePagination}
                  total={totalBookings}
                  showQuickJumper
                />
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default BookingHistory;
