import {Modal} from 'antd'
import {lazy} from 'react'

const RatingForm = lazy(() => import("./RatingForm"));
// eslint-disable-next-line react/prop-types
function RatingModal({isRatingModalOpen, handleRatingOk, handleCancel, employeeID, avatar, employeeName, handleData , selectedBookingId}) {
    return (
        <>
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
                open={isRatingModalOpen}
                keyboard={true}
                centered
                onOk={handleRatingOk}
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
                    handleRatingOk();
                    handleData();
                  }}
                  bookingId={selectedBookingId}
                />
              </Modal>
        </>
    )
}
export default RatingModal;