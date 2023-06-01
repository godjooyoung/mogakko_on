import styled from 'styled-components';

// Overlay
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px); // 블러 처리
`;

// Modal
const ModalWrapper = styled.div`
  width: 500px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const Modal = ({ open, children, close }) => {
  if (!open) return null;
  return (
    <Overlay>
      <ModalWrapper>
        {children}
      </ModalWrapper>
    </Overlay>
  );
};

export default Modal;
