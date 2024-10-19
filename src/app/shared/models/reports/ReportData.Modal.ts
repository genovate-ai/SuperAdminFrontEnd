import { Time } from '@angular/common'

export class ReportDataM {
    runId ? = '';
    date ? = '';
    time ?: any = '';
    instrumentId ? = '';
    cartridgeId ?= '';
    sampleId ?= '';
    laneNum ?= '';
    pathogen ?= '';
    outcome ?= '';
    countOutcome ?= '';
    errorCode ?: string;
    w1CellCount ?= 0;
    w1PCCount ?= 0;
    w1CellMeanIntensity ?= 0;
    w2CellCount ?= 0;
    w2PCCount ?= 0;
    w2CellMeanIntensity ?= 0;
    status ?= '';
    w2CellCountStatus ? = '';
    version ? = '';
    actualDate?: any = null;

    result_status? = '';
    site_id? = '';
    sample_matrix? = '';
    customer_sample_id? = '';
    metadata_date_recieved? = '';
    user_name? = '';
    kit_lot? = '';

    collection_site_id? = '';
    collection_site_type? = '';
    dilution_factor? = '';
    requested_assay? = '';
    flock_id? = '';

    source_scanDateTime? = '';

    source_outcome? = '';
    outcome_quantitative? = '';
    state? = false;

    siteHeirarchy? = [];

}
