import React from "react";
import useReview from "../../../hooks/useReview";

type Props = {
  createdAt: number;
  isUpdated: boolean;
  changeListener: number | undefined;
};

const CreatedTime = React.memo(
  ({ createdAt, isUpdated, changeListener }: Props) => {
    const nowTimestamp = new Date().getTime();
    const timeDifference: number = Math.floor(
      (nowTimestamp - createdAt) / 1000
    );
    const formatTimeDifference = (timeDifference: number): string => {
      if (timeDifference < 60) {
        return "방금 전";
      } else if (timeDifference < 3600) {
        const minutes = Math.floor(timeDifference / 60);
        return `${minutes}분 전`;
      } else if (timeDifference < 86400) {
        const hours = Math.floor(timeDifference / 3600);
        return `${hours}시간 전`;
      } else if (timeDifference < 604800) {
        const days = Math.floor(timeDifference / 86400);
        return `${days}일 전`;
      } else if (timeDifference < 2419200) {
        const weeks = Math.floor(timeDifference / 604800);
        return `${weeks}주 전`;
      } else {
        const months = Math.floor(timeDifference / 2419200);
        return `${months}달 전`;
      }
    };

    return (
      <div>
        {isUpdated
          ? formatTimeDifference(timeDifference) + "(수정됨)"
          : formatTimeDifference(timeDifference)}
      </div>
    );
  }
);

export default CreatedTime;
