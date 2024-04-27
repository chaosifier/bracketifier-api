export interface TournamentCreateUpdateRequestModel {
    title: string,
    description: string,
    start_date: string,
    end_date: string,
    max_participants: number,
    type: string,
}

export enum TOURNAMENT_STATUS_ENUM {
    UPCOMING = 'UPCOMING',
    ONGOING = 'ONGOING',
    CANCELLED = 'CANCELLED',
    ENDED = 'ENDED'
}

export enum TOURNAMENT_TYPE {
    SINGLE_ELIMINATION = 'SINGLE_ELIMINATION',
    DOUBLE_ELIMINATION = 'DOUBLE_ELIMINATION',
    ROUND_ROBIN = 'ROUND_ROBIN',
    GROUP_STAGE = 'GROUP_STAGE'
}