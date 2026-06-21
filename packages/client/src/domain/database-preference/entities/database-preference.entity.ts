export interface DatabasePreference {
	/** Notion database ID */
	id: string;
	/** User-defined display title; falls back to Notion title when absent */
	customTitle?: string
	/** When true the database is hidden from the home screen */
	hidden: boolean
}