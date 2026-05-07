export const APP_EVENTS = {
    addedCv: 'cv.added',
    updatedCv: 'cv.updated',
    deletedCv: 'cv.deleted',
    restoredCv: 'cv.restored',
} as const;

export type AppEventName = (typeof APP_EVENTS)[keyof typeof APP_EVENTS];