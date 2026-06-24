import pytest

from runapi.core import config
from runapi.core.errors import AuthenticationError, ValidationError
from runapi.veo_3_1 import Veo31Client
from runapi.veo_3_1.resources.extend_video import ExtendVideo
from runapi.veo_3_1.resources.text_to_video import TextToVideo
from runapi.veo_3_1.resources.upscale_video import UpscaleVideo
from runapi.veo_3_1.types import (
    CompletedExtendVideoResponse,
    CompletedTextToVideoResponse,
    CompletedUpscaleVideoResponse,
    ExtendVideoResponse,
    TextToVideoResponse,
    UpscaleVideoResponse,
)


class FakeHttp:
    def __init__(self, *responses):
        self._responses = list(responses)
        self.calls = []

    def request(self, method, path, body=None, options=None):
        self.calls.append((method, path, body))
        if self._responses:
            return self._responses.pop(0)
        return {"id": "task_1", "status": "pending"}


@pytest.fixture(autouse=True)
def reset_config(monkeypatch):
    monkeypatch.delenv("RUNAPI_API_KEY", raising=False)
    monkeypatch.setattr(config, "api_key", None)
    yield


# --- auth -----------------------------------------------------------------


def test_accepts_api_key_parameter():
    assert isinstance(Veo31Client(api_key="k", http_client=FakeHttp()), Veo31Client)


def test_falls_back_to_global(monkeypatch):
    monkeypatch.setattr(config, "api_key", "global-key")
    assert isinstance(Veo31Client(http_client=FakeHttp()), Veo31Client)


def test_falls_back_to_env(monkeypatch):
    monkeypatch.setenv("RUNAPI_API_KEY", "env-key")
    assert isinstance(Veo31Client(http_client=FakeHttp()), Veo31Client)


def test_raises_without_api_key():
    with pytest.raises(AuthenticationError, match="API key is required"):
        Veo31Client()


# --- injection / accessors ------------------------------------------------


def test_uses_injected_http_client():
    fake = FakeHttp()
    client = Veo31Client(api_key="k", http_client=fake)
    assert client.text_to_video._http is fake
    assert client.extend_video._http is fake
    assert client.upscale_video._http is fake


def test_exposes_resource_accessors():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    assert isinstance(client.text_to_video, TextToVideo)
    assert isinstance(client.extend_video, ExtendVideo)
    assert isinstance(client.upscale_video, UpscaleVideo)


# --- request shapes -------------------------------------------------------


def test_text_to_video_create_posts_compacted_body():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = Veo31Client(api_key="k", http_client=fake)
    result = client.text_to_video.create(
        model="veo-3.1-fast", prompt="a kite", aspect_ratio="16:9", duration_seconds=None
    )
    assert fake.calls == [
        ("post", "/api/v1/veo_3_1/text_to_video", {"model": "veo-3.1-fast", "prompt": "a kite", "aspect_ratio": "16:9"}),
    ]
    assert isinstance(result, TextToVideoResponse)


def test_text_to_video_get_fetches_by_id():
    fake = FakeHttp({"id": "t1", "status": "processing"})
    client = Veo31Client(api_key="k", http_client=fake)
    client.text_to_video.get("t1")
    assert fake.calls == [("get", "/api/v1/veo_3_1/text_to_video/t1", None)]


def test_extend_video_create_posts_source_task_id():
    fake = FakeHttp({"id": "e1", "status": "pending"})
    client = Veo31Client(api_key="k", http_client=fake)
    result = client.extend_video.create(source_task_id="t1", prompt="keep going")
    assert fake.calls == [
        ("post", "/api/v1/veo_3_1/extend_video", {"source_task_id": "t1", "prompt": "keep going"}),
    ]
    assert isinstance(result, ExtendVideoResponse)


def test_extend_video_get_fetches_by_id():
    fake = FakeHttp({"id": "e1", "status": "processing"})
    client = Veo31Client(api_key="k", http_client=fake)
    client.extend_video.get("e1")
    assert fake.calls == [("get", "/api/v1/veo_3_1/extend_video/e1", None)]


def test_upscale_video_create_posts_source_task_id():
    fake = FakeHttp({"id": "u1", "status": "pending"})
    client = Veo31Client(api_key="k", http_client=fake)
    result = client.upscale_video.create(source_task_id="t1", output_resolution="4k")
    assert fake.calls == [
        ("post", "/api/v1/veo_3_1/upscale_video", {"source_task_id": "t1", "output_resolution": "4k"}),
    ]
    assert isinstance(result, UpscaleVideoResponse)


def test_upscale_video_get_fetches_by_id():
    fake = FakeHttp({"id": "u1", "status": "processing"})
    client = Veo31Client(api_key="k", http_client=fake)
    client.upscale_video.get("u1")
    assert fake.calls == [("get", "/api/v1/veo_3_1/upscale_video/u1", None)]


# --- run narrowing --------------------------------------------------------


def test_text_to_video_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "videos": [{"url": "https://x/y.mp4"}]},
    )
    client = Veo31Client(api_key="k", http_client=fake)
    result = client.text_to_video.run(model="veo-3.1-fast", prompt="a serene lake")
    assert isinstance(result, CompletedTextToVideoResponse)
    assert result.videos[0].url == "https://x/y.mp4"


def test_extend_video_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "e1", "status": "pending"},
        {"id": "e1", "status": "completed", "videos": [{"url": "https://x/e.mp4"}]},
    )
    client = Veo31Client(api_key="k", http_client=fake)
    result = client.extend_video.run(source_task_id="t1", prompt="continue")
    assert isinstance(result, CompletedExtendVideoResponse)
    assert result.videos[0].url == "https://x/e.mp4"


def test_upscale_video_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "u1", "status": "pending"},
        {"id": "u1", "status": "completed", "videos": [{"url": "https://x/u.mp4"}]},
    )
    client = Veo31Client(api_key="k", http_client=fake)
    result = client.upscale_video.run(source_task_id="t1", output_resolution="1080p")
    assert isinstance(result, CompletedUpscaleVideoResponse)
    assert result.videos[0].url == "https://x/u.mp4"


# --- validation -----------------------------------------------------------


def test_text_to_video_requires_model():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="model must be one of: veo-3.1, veo-3.1-fast"):
        client.text_to_video.create(prompt="hi")


def test_text_to_video_requires_prompt():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="prompt is required"):
        client.text_to_video.create(model="veo-3.1-fast")


def test_text_to_video_rejects_unknown_model():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="model must be one of: veo-3.1, veo-3.1-fast"):
        client.text_to_video.create(model="nope", prompt="hi")


def test_text_to_video_rejects_invalid_aspect_ratio():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="aspect_ratio must be one of: 16:9, 9:16, auto"):
        client.text_to_video.create(model="veo-3.1-fast", prompt="hi", aspect_ratio="4:3")


def test_text_to_video_rejects_invalid_duration():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="duration_seconds must be one of: 4, 6, 8"):
        client.text_to_video.create(model="veo-3.1-fast", prompt="hi", duration_seconds=5)


def test_first_and_last_frames_requires_first_frame():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="first_frame_image_url is required for first_and_last_frames"):
        client.text_to_video.create(model="veo-3.1-fast", prompt="hi", input_mode="first_and_last_frames")


def test_reference_requires_reference_image_urls():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="reference_image_urls is required for reference"):
        client.text_to_video.create(model="veo-3.1-fast", prompt="hi", input_mode="reference")


def test_reference_requires_fast_model():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="reference requires model veo-3.1-fast"):
        client.text_to_video.create(
            model="veo-3.1", prompt="hi", input_mode="reference", reference_image_urls=["https://x/a.png"]
        )


def test_reference_image_urls_without_reference_mode_rejected():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="reference_image_urls requires input_mode reference"):
        client.text_to_video.create(
            model="veo-3.1-fast", prompt="hi", input_mode="text", reference_image_urls=["https://x/a.png"]
        )


def test_extend_video_requires_source_task_id():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="source_task_id is required"):
        client.extend_video.create(prompt="continue")


def test_extend_video_requires_prompt():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="prompt is required"):
        client.extend_video.create(source_task_id="t1")


def test_upscale_video_requires_source_task_id():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="source_task_id is required"):
        client.upscale_video.create(output_resolution="4k")


def test_upscale_video_rejects_invalid_output_resolution():
    client = Veo31Client(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="output_resolution must be one of"):
        client.upscale_video.create(source_task_id="t1", output_resolution="720p")
