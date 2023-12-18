import { Modal} from 'antd';
import { lazy} from 'react'

const BookingEditForm = lazy(() => import('./BookingEditForm'));
// eslint-disable-next-line react/prop-types
function BookingEditModal({selectedBooking, handleData, userId , isEditModalOpen, handleEdit, handleEditOk}) {
    return (
        <>
            <Modal
                width={800}
                title={
                  <span
                    style={{
                      fontSize: "20px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Edit Booking
                  </span>
                }
                destroyOnClose={true}
                open={isEditModalOpen}
                keyboard={true}
                centered
                onOk={handleEditOk}
                onCancel={handleEdit}
                closeIcon={false}
                cancelButtonProps={{ style: { display: "none" } }}
                okButtonProps={{ style: { display: "none" } }}
              >
                <BookingEditForm
                  selectedBooking={selectedBooking}
                  onEditingSubmit={() => {
                    handleEditOk();
                    handleData();
                  }}
                  userId={userId}
                />
              </Modal>
        </>
    )
}
export default BookingEditModal;