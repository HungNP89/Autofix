import { useNavigate, Link } from "react-router-dom";
import { authContext } from "../Helpers/AuthContext";
import { useContext, useState, useEffect, lazy } from "react";
import Cookies from "js-cookie";
import {
  Button,
  Layout,
  Menu,
  theme,
  Table,
  Pagination,
  Modal,
  Popover,
} from "antd";
import {
  CalendarOutlined,
  ExclamationCircleOutlined,
  LogoutOutlined,
  BarsOutlined,
  EditOutlined,
  CloseOutlined,
  StarOutlined,
} from "@ant-design/icons";
import "../Design/BookingDetail.css";
import dayjs from "dayjs";
const RatingModal = lazy(() => import("./RatingModal"));
const BookingEditModal = lazy(() => import("./BookingEditModal"));

function BookingDetail() {
  const { Content, Sider } = Layout;
  const { setAuthData } = useContext(authContext);
  const [booking, setBooking] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectBooking, setSelectBooking] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalBookings12, setTotalBookings12] = useState(0);
  const [totalBookings343, setTotalBookings343] = useState(0);
  const [totalBookings344, setTotalBookings344] = useState(0);
  const [loading, setLoading] = useState(false);
  const postPerPage = 10;
  // eslint-disable-next-line no-unused-vars
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [firstLetter, setFirstLetter] = useState("");
  const [isEditModalOpen, setIsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [selectedTable, setSelectedTable] = useState("all");
  const [employeeID, setEmployeeID] = useState("");
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
  const listBooking = `https://autofix-server.onrender.com/booking/all?id=${userId}&currentPage=${currentPage}&limit=${postPerPage}`;
  const handleData = async () => {
    try {
      setLoading(true);
      const response = await fetch(listBooking);
      if (response.ok) {
        const data = await response.json();
        let filterBooking;

        switch (selectedTable) {
          case "all":
            filterBooking = data.bookings.all;
            setTotalBookings(data.total.Bookings);
            break;
          case "processing":
            filterBooking = data.bookings.byStatus12.filter(
              (booking) => booking.status === 1 || booking.status === 2
            );
            setTotalBookings12(data.total.BookingsByStatus12);
            break;
          case "finished":
            filterBooking = data.bookings.byStatus34.filter(
              (booking) => booking.status === 3
            );
            setTotalBookings343(data.total.BookingsByStatus3);
            break;
          case "cancelled":
            filterBooking = data.bookings.byStatus34.filter(
              (booking) => booking.status === 4
            );
            setTotalBookings344(data.total.BookingsByStatus4);
            break;
          default:
            console.error("Invalid filter");
            filterBooking = data.bookings.bookings;
            setTotalBookings(data.total.Bookings);
            break;
        }
        // const filterBooking = data.bookings12.filter(
        //   (booking) => booking.status === 1 || booking.status === 2
        // );
        setTimeout(() => {
          setLoading(false);
          setBooking(filterBooking);
        }, 2000);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterClick = (filter) => {
    setSelectedTable(filter);
    setCurrentPage(1);
    handleData(filter);
  };

  useEffect(() => {
    if (userId) {
      handleData(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, userId, selectedTable]);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
    handleData(userId);
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

  const handleCancel = async (cancel) => {
    try {
      setLoading(true);
      const response = await fetch(listBooking);
      if (response.ok) {
        const cancelBooking = await fetch(
          `https://autofix-server.onrender.com/booking/all/${cancel}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: 4,
            }),
          }
        );
        if (cancelBooking.ok) {
          const updatedBookings = booking.filter(
            (booking) => booking._id !== cancel
          );
          setLoading(false);
          setBooking(updatedBookings);
        }
        if (booking.length % postPerPage === 1 && currentPage > 1) {
          handlePagination(currentPage - 1);
        } else {
          handleData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showEditPopup = () => {
    setIsModalOpen(true);
  };

  const showRatingPopup = () => {
    setIsRatingModalOpen(true);
  };

  const handleEditOk = () => {
    setIsModalOpen(false);
  };

  const handleRatingOk = () => {
    setIsRatingModalOpen(false);
  };

  const handleEdit = () => {
    setIsModalOpen(false);
  };

  const buttonEdit = (record) => {
    const bookingId = record._id;
    if (bookingId) {
      setSelectedBooking(bookingId);
      showEditPopup();
    } else {
      console.error("Booking ID not found.");
    }
  };

  const cancelBooking = (record) => {
    setSelectBooking(record);
    setLoading(true);
    Modal.confirm({
      title: "Are you sure you want to cancel this booking?",
      icon: <ExclamationCircleOutlined />,
      content:
        "If agree, please choose OK to cancel this booking or Cancel if you change your mind.",
      onOk: () => {
        setLoading(false);
        handleCancel(record._id);
      },
      onCancel: () => {
        setLoading(false);
      },
    });
  };

  const buttonFinish = (record) => {
    const mechanicId = record.status === 3 ? record.employee_id[0]._id : null;
    if (mechanicId) {
      setEmployeeID(mechanicId);
      setAvatar(record.employee_id[0].avatar);
      setEmployeeName(record.employee_id[0].employee_name);
      setSelectedBookingId(record._id);
      showRatingPopup();
    } else {
      console.error("Mechanic ID not found.");
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      1: "Not Approved",
      2: "Approved",
      3: "Finished",
      4: "Cancelled",
    };

    return statusMap[status] || "Unknown Status";
  };

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
      render: getStatusText,
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line no-unused-vars
      render: (text, record) => (
        <div>
          {record.status === 1 && (
            <Button
              style={{ marginRight: 10 }}
              onClick={() => buttonEdit(record)}
            >
              <EditOutlined />
            </Button>
          )}
          {record.status === 3 && !record.isRating ? (
            <Button
              onClick={() => buttonFinish(record)}
              disabled={record.isRating}
            >
              <StarOutlined />
            </Button>
          ) : null}

          {record.status !== 4 && record.status !== 3 && (
            <Button onClick={() => cancelBooking(record)}>
              <CloseOutlined />
            </Button>
          )}
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
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          {!collapsed && <div className="logo2">AUTOFIX</div>}
          <Menu
            style={{ marginTop: "50px" }}
            theme="dark"
            defaultSelectedKeys={["detail"]}
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
            <div className="content-header2">
              <div className="category">
                <a
                  onClick={() => handleFilterClick("all")}
                  style={{
                    color: selectedTable === "all" ? "black" : "#1677ff",
                  }}
                >
                  All Booking({totalBookings})
                </a>
                <a
                  onClick={() => handleFilterClick("processing")}
                  style={{
                    color: selectedTable === "processing" ? "black" : "#1677ff",
                  }}
                >
                  Processed({totalBookings12})
                </a>
                <a
                  onClick={() => handleFilterClick("finished")}
                  style={{
                    color: selectedTable === "finished" ? "black" : "#1677ff",
                  }}
                >
                  Finished({totalBookings343})
                </a>
                <a
                  onClick={() => handleFilterClick("cancelled")}
                  style={{
                    color: selectedTable === "cancelled" ? "black" : "#1677ff",
                  }}
                >
                  Cancelled({totalBookings344})
                </a>
              </div>

              <Popover
                content={content}
                title={
                  <span style={{ display: "flex", justifyContent: "center" }}>
                    Manage Account
                  </span>
                }
              >
                <Button className="user-icon1">{firstLetter}</Button>
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
              <BookingEditModal
                selectedBooking={selectedBooking}
                handleData={handleData}
                userId={userId}
                handleEdit={handleEdit}
                handleEditOk={handleEditOk}
                isEditModalOpen={isEditModalOpen}
              />
              <RatingModal
                isRatingModalOpen={isRatingModalOpen}
                handleRatingOk={handleRatingOk}
                handleData={handleData}
                handleCancel={handleCancel}
                employeeID={employeeID}
                avatar={avatar}
                employeeName={employeeName}
                selectedBookingId={selectedBookingId}
              />
              {(currentPage !== 1 || booking.length > 1) && (
                <Pagination
                  style={{ marginTop: 30 }}
                  current={currentPage}
                  onChange={handlePagination}
                  total={
                    selectedTable === "all"
                      ? totalBookings
                      : selectedTable === "processing"
                      ? totalBookings12
                      : selectedTable === "finished"
                      ? totalBookings343
                      : selectedTable === "cancelled"
                      ? totalBookings344
                      : 0
                  }
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

export default BookingDetail;
