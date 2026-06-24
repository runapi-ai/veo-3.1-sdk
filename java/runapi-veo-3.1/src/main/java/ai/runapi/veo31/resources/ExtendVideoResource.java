package ai.runapi.veo31.resources;

import ai.runapi.core.ClientOptions;
import ai.runapi.core.RequestOptions;
import ai.runapi.core.http.HttpTransport;
import ai.runapi.core.polling.TaskCreateResponse;
import ai.runapi.veo31.types.CompletedExtendVideoResponse;
import ai.runapi.veo31.types.ExtendVideoParams;
import ai.runapi.veo31.types.ExtendVideoResponse;

/** Extend Video operations. */
public final class ExtendVideoResource extends Veo31Resource {
  /** API endpoint path for extend video operations. */
  public static final String ENDPOINT = "/api/v1/veo_3_1/extend_video";

  /** Creates a resource bound to the supplied transport and client options. */
  public ExtendVideoResource(HttpTransport transport, ClientOptions options) {
    super(transport, options, ENDPOINT);
  }

  /** Creates a extend video task. */
  public TaskCreateResponse create(ExtendVideoParams params) {
    return create(params, RequestOptions.none());
  }

  /** Creates a extend video task with per-request options. */
  public TaskCreateResponse create(ExtendVideoParams params, RequestOptions options) {
    return createTask(params.action(), params.toMap(), options);
  }

  /** Retrieves a extend video task by ID. */
  public ExtendVideoResponse get(String id) {
    return get(id, RequestOptions.none());
  }

  /** Retrieves a extend video task by ID with per-request options. */
  public ExtendVideoResponse get(String id, RequestOptions options) {
    return getTask(id, options, ExtendVideoResponse.class);
  }

  /** Creates a extend video task and polls until it completes. */
  public CompletedExtendVideoResponse run(ExtendVideoParams params) {
    return run(params, RequestOptions.none());
  }

  /** Creates a extend video task with per-request options and polls until it completes. */
  public CompletedExtendVideoResponse run(ExtendVideoParams params, RequestOptions options) {
    return runTask(params.action(), params.toMap(), options, ExtendVideoResponse.class, CompletedExtendVideoResponse.class);
  }
}
