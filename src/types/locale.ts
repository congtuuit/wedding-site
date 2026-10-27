export interface WeddingLocaleDictionary {
  opening: {
    invitationHonorificPersonalized: string;
    invitationHonorificGeneral: string;
    openButton: string;
    openingProgress: string;
    hintLoading: string;
    hintIdle: string;
  };
  hero: {
    badge: string;
    rsvpButton: string;
    scrollDown: string;
    scrollDownAria: string;
  };
  family: {
    subtitle: string;
    titleQuePriority: string;
    titleSgPriority: string;
    brideSide: string;
    groomSide: string;
  };
  invitation: {
    subtitle: string;
    dearGuest: (guestName: string) => string;
  };
  countdown: {
    subtitle: string;
    headingPrefix: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    expiredQue: string;
    expiredSg: string;
    subtext: (ceremonyName: string) => string;
  };
  story: {
    subtitle: string;
    title: string;
  };
  events: {
    subtitle: string;
    title: string;
    filterAll: string;
    filterBride: string;
    filterGroom: string;
    categoryGroom: string;
    categoryBride: string;
    getDirections: string;
    getDirectionsShort: string;
  };
  gallery: {
    subtitle: string;
    title: string;
    description: string;
    viewDetails: string;
    viewAllPhotos: (count: number) => string;
    collapsePhotos: string;
    hint: string;
  };
  rsvp: {
    subtitle: string;
    title: string;
    description: string;
    successTitle: string;
    successMessage: (guestName: string) => string;
    editResponse: string;
    guestNameLabel: string;
    guestNamePlaceholder: string;
    attendingLabel: string;
    attendingYes: string;
    attendingNo: string;
    eventSelectionLabel: string;
    eventOptionAll: string;
    eventOptionSg: string;
    eventOptionQue: string;
    guestCountLabel: string;
    submitting: string;
    submitButton: string;
    alertNameRequired: string;
  };
  wishes: {
    subtitle: string;
    title: string;
    description: (coupleShortName: string) => string;
    nameLabel: string;
    namePlaceholder: string;
    messageLabel: (coupleShortName: string) => string;
    messagePlaceholder: string;
    successBadge: string;
    displayHint: string;
    sending: string;
    sendButton: string;
    wishesCount: (count: number) => string;
    scrollHint: string;
    prevWishAria: string;
    nextWishAria: string;
  };
  gift: {
    subtitle: string;
    title: string;
    description: string;
    groomBadge: string;
    brideBadge: string;
    bankLabel: string;
    accountNumberLabel: string;
    accountHolderLabel: string;
    memoLabel: string;
    copyAccount: string;
    copiedAccount: string;
    copyMemo: string;
    copiedMemo: string;
    showQr: string;
    downloadQr: string;
    downloading: string;
    qrModalTitle: string;
    closeModal: string;
    zoomQr: string;
    ownerPrefix: string;
    memoPrefix: string;
    copyMemoShort: string;
    copiedShort: string;
    copyAccountBtn: string;
    copiedAccountBtn: string;
    downloadQrBtn: string;
    downloadingBtn: string;
  };
  thankYou: {
    title: string;
    subtitle: string;
    footerQuote: (initials: string) => string;
  };
  nav: {
    invitation: string;
    events: string;
    gallery: string;
    rsvp: string;
    gift: string;
  };
  controls: {
    musicPlay: string;
    musicPause: string;
    scrollStart: string;
    scrollPause: string;
  };
}
