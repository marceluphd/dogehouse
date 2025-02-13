import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useConn } from "../../shared-hooks/useConn";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { ProfileBlock } from "../../ui/ProfileBlock";
import { UpcomingRoomsCard } from "../../ui/UpcomingRoomsCard";
import { UserSummaryCard } from "../../ui/UserSummaryCard";
import { CreateScheduleRoomModal } from "../scheduled-rooms/CreateScheduledRoomModal";
import { EditProfileModal } from "../user/EditProfileModal";
import { MinimizedRoomCardController } from "./MinimizedRoomCardController";

interface ProfileBlockControllerProps { }

export const ProfileBlockController: React.FC<ProfileBlockControllerProps> = ({ }) => {
  const { currentRoomId } = useCurrentRoomIdStore();
  const conn = useConn();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [
    showCreateScheduleRoomModal,
    setShowCreateScheduleRoomModal,
  ] = useState(false);
  const { data } = useTypeSafeQuery(["getScheduledRooms", "", false]);
  const { push } = useRouter();

  return (
    <>
      <EditProfileModal
        isOpen={showEditProfileModal}
        onRequestClose={() => setShowEditProfileModal(false)}
      />
      {showCreateScheduleRoomModal ? (
        <CreateScheduleRoomModal
          onScheduledRoom={() => { }}
          onRequestClose={() => setShowCreateScheduleRoomModal(false)}
        />
      ) : null}
      <ProfileBlock
        top={
          currentRoomId ? (
            <MinimizedRoomCardController roomId={currentRoomId} />
          ) : (
            <UserSummaryCard
              onClick={() => setShowEditProfileModal(true)}
              badges={[]}
              website=""
              isOnline={false}
              {...conn.user}
              username={conn.user.username}
            />
          )
        }
        bottom={
          <UpcomingRoomsCard
            onCreateScheduledRoom={() => setShowCreateScheduleRoomModal(true)}
            rooms={
              data?.scheduledRooms.slice(0, 3).map((sr) => ({
                onClick: () => {
                  push(`/scheduled-room/[id]`, `/scheduled-room/${sr.id}`);
                },
                id: sr.id,
                scheduledFor: new Date(sr.scheduledFor),
                title: sr.name,
                speakersInfo: {
                  avatars: [sr.creator.avatarUrl],
                  speakers: [sr.creator.username],
                },
              })) || []
            }
          />
        }
      />
    </>
  );
};
