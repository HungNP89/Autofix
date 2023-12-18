/* eslint-disable no-unused-vars */
import { CalendarOutlined } from "@ant-design/icons";
import {
  Modal,
  Button,
  Rate,
  Tooltip,
  Spin,
  Space,
  Avatar,
  message,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MiniCalendar from "./MiniCalendar";
import dayjs from "dayjs";
import "../Design/BookingForm.css";
import { ExclamationCircleOutlined } from "@ant-design/icons";

// eslint-disable-next-line react/prop-types
function BookingEditForm({ selectedBooking, userId, onEditingSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hours, setHours] = useState([]);
  const [buttonDisable, setButtonDisable] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [activeMechanic, setActiveMechanic] = useState(null);
  const [selectHour, setSelectHour] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const showPopup = () => {
    setIsModalOpen(true);
  };

  const handleOk = (selectedDate) => {
    setIsModalOpen(false);
    setSelectedDate(selectedDate);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const openCalendar = () => {
    showPopup();
  };

  const getHour = async () => {
    const date = selectedDate.format("YYYY-MM-DD");
    console.log(date);
    try {
      const response = await fetch(
        `http://localhost:3000/hour/shifts?date=${date}`
      );
      if (response.ok) {
        const data = await response.json();
        const { hours, unAvailableHours } = data;

        const disableArray = hours.map((hour) => {
          const unAvailableHour = unAvailableHours.find(
            (item) => item.hourId === hour._id
          );
          //console.log(unAvailableHour)
          return unAvailableHour ? unAvailableHour.unAvailable : false;
        });
        setButtonDisable(disableArray);
        console.log(disableArray);
        setHours(hours);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const currentHour = dayjs().format("H.m");
  const currentDate = dayjs().format("YYYY-MM-DD");

  const handleClick = async (buttonIndex) => {
    setActiveButton(buttonIndex);
    setSelectHour(hours[buttonIndex]);

    const selectedHour = hours[buttonIndex]._id;
    const date = selectedDate.format("YYYY-MM-DD");
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/employee/all?date=${date}&hour=${selectedHour}`
      );
      if (response.ok) {
        const data = await response.json();
        setTimeout(() => {
          setEmployees(data);
          setIsLoading(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleMechanicClick = (mechanicIndex) => {
    setActiveMechanic(mechanicIndex);
    setSelectedEmployee(employees[mechanicIndex]);
  };

  const handleSubmit = async () => {
    const selectedHour = hours[activeButton]._id;
    const date = selectedDate.format("YYYY-MM-DD");
    const selectedEmployee = employees[activeMechanic]._id;

    try {
      const response = await fetch(`http://localhost:3000/booking/createP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          user_google_id: userId,
          employee_id: selectedEmployee,
          hours_id: selectedHour,
          date: date,
          status: 1,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const deleteResponse = await fetch(
          `http://localhost:3000/booking/all/${selectedBooking}`,
          {
            method: "DELETE",
          }
        );
        if (deleteResponse.ok) {
          if (onEditingSubmit) {
            setTimeout(() => {
              onEditingSubmit();
            }, 2000);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const info = () => {
    messageApi.open({
      type: "info",
      content: "Please reload page to see the update",
      duration: 3,
    });
  };
  const fail = () => {
    messageApi.open({
      type: "error",
      content: "Cancel edit booking",
      duration: 2,
    });
  };

  const notify = () => {
    messageApi.open({
      type: "warning",
      content: "Please select hours and mechanic before submitting",
      duration: 2,
    });
  };

  const editBooking = () => {
    Modal.confirm({
      title: "Are you sure you want to book?",
      icon: <ExclamationCircleOutlined />,
      content:
        "If agree, please choose OK to confirm your edit or Cancel if you change your mind.",
      onOk: () => {
        handleSubmit();
        if (selectHour === null || selectedEmployee === null) {
          notify();
        }
      },
      onCancel: () => {
        fail();
      },
    });
  };
  return (
    <div>
      {contextHolder}
      <div>
        <div style={{ fontSize: 18 }}>
          Choose new date{" "}
          <CalendarOutlined style={{ marginLeft: 10 }} onClick={openCalendar} />
          <Modal
            width={350}
            title={<span style={{ fontSize: "30px" }}>Calendar</span>}
            destroyOnClose={true}
            open={isModalOpen}
            keyboard={true}
            centered
            onOk={handleOk}
            onCancel={handleCancel}
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={{ style: { display: "none" } }}
          >
            <MiniCalendar onSelectDate={(date) => handleOk(date)} />
          </Modal>
        </div>
      </div>
      <div style={{ marginBottom: "10px", fontSize: 20 }}>Time</div>
      <div className="form">
        {hours.map((hour, index) => {
          const startTime = parseInt(hour.hours.split("-")[0], 10);
          const isDisabledButton =
            buttonDisable[index] ||
            (selectedDate.format("YYYY-MM-DD") === currentDate &&
              startTime < currentHour);

          return (
            <div key={index}>
              <Button
                onClick={() => handleClick(index)}
                style={{
                  backgroundColor: activeButton === index ? "#1677ff" : "white",
                  color: activeButton === index ? "white" : "black",
                }}
                disabled={isDisabledButton}
              >
                {hour.hours}
              </Button>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          marginTop: 20,
        }}
      >
        <div>Mechanic</div>
      </div>
      {isloading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <Spin />
        </div>
      ) : (
        <div
          className="form-mechanic"
          style={{ overflowY: "scroll", maxHeight: "40vh" }}
        >
          {employees.map((employee, index) => {
            return (
              <Space key={index}>
                <Button
                  onClick={() => handleMechanicClick(index)}
                  style={{
                    backgroundColor:
                      activeMechanic === index ? "#1677ff" : "white",
                    color: activeMechanic === index ? "white" : "black",
                    height: 85,
                    width: 320,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      style={{ height: 65, width: 65, flex: 0.4 }}
                      src={employee.avatar}
                    />

                    <div
                      style={{ flex: 1.6, marginBottom: 10, marginLeft: 10 }}
                    >
                      <Tooltip title={employee.employee_name}>
                        <p
                          style={{
                            maxWidth: "120px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginLeft: 50,
                          }}
                        >
                          {`${employee.employee_name} (${employee.totalRating})`}
                        </p>
                      </Tooltip>
                      <Rate defaultValue={employee.rating} disabled allowHalf />
                    </div>
                  </div>
                </Button>
              </Space>
            );
          })}
        </div>
      )}
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}
      >
        <Button type="primary" onClick={editBooking}>
          Submit
        </Button>
      </div>
    </div>
  );
}
export default BookingEditForm;
