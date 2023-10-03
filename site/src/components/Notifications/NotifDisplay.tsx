import {
  Alert
} from '@material-tailwind/react';
import { useNotification } from './NotificationsProvider';
import { AiFillCheckCircle, AiFillCloseCircle, AiFillInfoCircle, AiFillQuestionCircle, AiFillWarning } from 'react-icons/ai';
import classNames from 'classnames';
import styled from 'styled-components';

const StyledAlert = styled.div`
  button {
    color: #666;
  }
`;

export function NotifDisplay (): JSX.Element {
  const { notifications, removeNotif } = useNotification();

  const iconSize = '24px';

  function NotifIcon (type: string): JSX.Element {
    switch (type) {
      case 'question':
        return <AiFillQuestionCircle size={iconSize} />;

      case 'info':
        return <AiFillInfoCircle size={iconSize} />;

      case 'success':
        return <AiFillCheckCircle size={iconSize} />;

      case 'warning':
        return <AiFillWarning size={iconSize} />;

      case 'error':
        return <AiFillCloseCircle size={iconSize} />;
    }

    return <></>
  }

  //
  return (
    <StyledAlert className='fixed bottom-0 right-0 mb-5 mr-5 space-y-2'>
    { notifications.map((notif) =>
      <Alert
        key={notif.id}
        icon={NotifIcon(notif.type)}
        open={notif.open}
        animate={{
          mount: { x: 0 },
          unmount: { x: 200 }
        }}
        onClose={() => { removeNotif(notif.id); }}
        className={classNames('rounded-none border-l-4 font-medium', `notif-${notif.type}`)}
      >
        {notif.text}
      </Alert>
    )}
    </StyledAlert>
  );
}
