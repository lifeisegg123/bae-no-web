import { useMemo, useState } from "react";

import { useReastorageValue } from "@reastorage/react";
import Script from "next/script";

import { useOpenShareDealMutation } from "src/graphql";
import useCurrentLocation from "src/hooks/useCurrentLocation";
import Information from "src/modules/Chat/Confirm/Information";
import ConfirmMap from "src/modules/Chat/Confirm/Map";
import Thumnail from "src/modules/Chat/Confirm/Thumnail";
import { createChatFormStorage } from "src/modules/Chat/CreateForm/storage";
import { Box } from "src/ui/Box";
import { Button } from "src/ui/Button";
import { Container } from "src/ui/Container";
import Divider from "src/ui/Divider";
import { Header } from "src/ui/Layout";
import { getDistanceFromCoordinates } from "src/utils/getDistanceFromCoordinates";

const ConfirmPage = () => {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const createChatForm = useReastorageValue(createChatFormStorage);
  const { category, maxParticipant, orderPrice, shareZone, storeName, title } =
    createChatForm;
  const location = useCurrentLocation();

  const distance = useMemo(() => {
    if (!location || !shareZone) return null;
    return getDistanceFromCoordinates(location, shareZone);
  }, [location, shareZone]);

  const [isNaverMapReady, setIsNaverMapReady] = useState(false);

  const { mutate } = useOpenShareDealMutation({
    onSuccess: () => {
      createChatFormStorage.reset();
      // TODO: 채팅방으로 이동
    },
  });

  const handleSubmit = () => {
    mutate({
      input: {
        ...createChatForm,
        thumbnail: thumbnailUrl,
      },
    });
  };

  return (
    <Box gap="24">
      <Box position="relative" width="full">
        <Box left="16" position="absolute" top="16" zIndex={1}>
          <Header.Back />
        </Box>
        <Thumnail
          category={category}
          setThumbnailUrl={setThumbnailUrl}
          thumbnailUrl={thumbnailUrl}
        />
      </Box>
      <Container>
        <Information title={title}>
          <Information.Item
            affix="명"
            label="공유인원"
            value={String(maxParticipant)}
          />
          <Information.Item label="카테고리" value={category} />
          <Information.Item label="주문할 가게" value={storeName} />
          <Information.Item
            affix="원"
            label="배달비"
            value={String(orderPrice)}
          />
        </Information>
        <Divider backgroundColor="black7" height="1" my="24" width="full" />
        <Information title="공유존 정보">
          <Information.Item
            label="거리"
            value={
              Number.isNaN(distance) ? "계산중..." : `${String(distance)}km`
            }
          />
          <Information.Item label="주소" value={shareZone?.addressPath} />
          <Script
            src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_DEVELOPMENT_NAVER_CLIENT_ID}&submodules=geocoder`}
            strategy="afterInteractive"
            onReady={() => setIsNaverMapReady(true)}
          />
          {!!isNaverMapReady && <ConfirmMap center={shareZone} />}
        </Information>
      </Container>
      <Box height="128">
        <Box
          backgroundColor="white"
          bottom="0"
          left="0"
          paddingBottom="48"
          position="fixed"
          px="16"
          width="full"
          zIndex={100}
        >
          <Button size="l" type="button" onClick={handleSubmit}>
            완료
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmPage;
