export type LastActivityDTO = {
  id: number;
  type: 'redacao' | 'correcao';
  topic?: string;
  createdAt: Date;
};

export class DashboardResponse {
  private essayCreatedCount: number;
  private correctionRecieivedCount: number;
  private correctionCreatedCount: number;
  private lastActivity: LastActivityDTO;

  constructor(
    essayCreatedCount: number,
    correctionRecieivedCount: number,
    correctionCreatedCount: number,
    lastActivity: LastActivityDTO | null = null,
  ) {
    this.essayCreatedCount = essayCreatedCount;
    this.correctionRecieivedCount = correctionRecieivedCount;
    this.correctionCreatedCount = correctionCreatedCount;
    this.lastActivity = lastActivity || null;
  }
}
