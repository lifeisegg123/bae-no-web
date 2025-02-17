import { useRouter } from "next/router";

import { ChatStatus, useLeaveChat } from "src/graphql";
import { Box } from "src/ui/Box";
import { Button } from "src/ui/Button";
import { Icon } from "src/ui/Icon";
import { Typography } from "src/ui/Typography";

import { UpdateModal } from "../UpdateDealStatus/UpdateModal";

const POPUP_TEXT = {
  owner: `정말로 채팅방을 나가실건가요?
  공유딜 시작전에 대표자가 나가게되면,
  해당 채팅방은 파기됩니다.`,
  participant: `정말로 채팅방을 나가실건가요?
  채팅방을 나가면 해당 공유딜에 관해 나눈 내용은 전부 삭제됩니다.`,
};

interface LeaveChatProps {
  shareDealStatus?: ChatStatus["shareDealStatus"];
}

export const LeaveChat = ({ shareDealStatus }: LeaveChatProps) => {
  const router = useRouter();
  const { id } = router.query as { [key: string]: string };
  const { mutate } = useLeaveChat({
    onSuccess: () => router.back(),
  });
  const handleLeaveChat = () => {
    mutate({
      input: {
        shareDealId: id,
      },
    });
  };

  const isOwner = shareDealStatus?.isOwner;

  return (
    <UpdateModal
      isActive
      confirmBtn={<Button onClick={handleLeaveChat}>나가기</Button>}
      description={isOwner ? POPUP_TEXT.owner : POPUP_TEXT.participant}
      title="채팅방 나가기"
    >
      <Box flexDirection="row" gap="8">
        <Icon name="log-out" />
        <Typography color="black2" fontSize="body2-m">
          나가기
        </Typography>
      </Box>
    </UpdateModal>
  );
};
