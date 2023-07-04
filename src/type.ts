export type Referrer = {
    type: ReferrerType;
    name?: string;
    path?: string;
    utm?: Utm;
};

export enum ReferrerType {
    // Absence of referrer URL
    // OR based on utm
    DIRECT = 'DIRECT',

    // Based on the referrer URL
    SEARCH = 'SEARCH',

    // Based on the referrer URL
    // OR based on utm
    SOCIAL = 'SOCIAL',

    // Based on the referrer URL
    WEBSITE = 'WEBSITE',

    // Based on utm
    EMAIL = 'EMAIL',

    // Based on utm
    AFFILIATES = 'AFFILIATES',

    // Based on utm
    REFERRAL = 'REFERRAL',

    // Based on utm
    PAID_SEARCH = 'PAID_SEARCH',

    // Based on utm
    OTHER_ADVERTISING = 'OTHER_ADVERTISING',

    // Based on utm
    DISPLAY = 'DISPLAY',

    // Based on utm
    SMS = 'SMS'
}

type Utm = {
    // Product, promo code, or slogan
    campaign: string;

    // Marketing medium
    medium: string;

    // Referrer
    source: string;

    // Identify the paid keywords
    content: string;

    // Use to differentiate ads
    term: string;
};
