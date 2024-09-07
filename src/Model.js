import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree, extend } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

const Model = ({ explosionFactor }) => {
  const { scene } = useGLTF(
    "https://garaaz-store.s3.ap-south-1.amazonaws.com/3D+MODEL.glb"
  );
  const click = (e) => {
    e.stopPropagation();
    alert(`you clicked on ${e.object.name}`);
  };
  const [distances, setDistances] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  let previousExplosionFactor = explosionFactor;

  useEffect(() => {
    const parts = scene.children;

    // Calculate center of each part
    var centers = [];
    parts.forEach(function (i) {
      i.geometry.computeBoundingSphere();
      centers.push(i.geometry.boundingSphere.center);
    });

    // Average the centers of the various parts to find the center of them all together
    var center = new THREE.Vector3();
    centers.forEach(function (vec) {
      center = center.add(vec);
    });
    center.x /= centers.length;
    center.y /= centers.length;
    center.z /= centers.length;
    const distancesTemp = [];
    // Go through each part and move them away from the center
    parts.forEach(function (i) {
      // Finding the vector between the center and the part and normalizing it
      var childCenter = i.geometry.boundingSphere.center;
      var direction = childCenter.sub(center);
      direction = direction.normalize();
      distancesTemp.push({
        originalX: i.position.x,
        originalY: i.position.y,
        originalZ: i.position.z,
        explodedDistanceX: direction.x,
        explodedDistanceY: direction.y,
        explodedDistanceZ: direction.z,
      });
    });
    setDistances(distancesTemp);
    setIsLoaded(true);
  }, [scene]);

  useEffect(() => {
    if (isLoaded) {
      if (previousExplosionFactor < explosionFactor) {
        deplodeProduct();
      } else {
        explodeProduct();
      }
      previousExplosionFactor = explosionFactor;
    }
  }, [explosionFactor, isLoaded]);

  function explodeProduct() {
    const parts = scene.children;
    parts.forEach(function (i, v) {
      i.position.x =
        distances[v].originalX +
        (distances[v].explodedDistanceX / 100) * explosionFactor;
      i.position.y =
        distances[v].originalY +
        (distances[v].explodedDistanceY / 100) * explosionFactor;
      i.position.z =
        distances[v].originalZ +
        (distances[v].explodedDistanceZ / 100) * explosionFactor;
    });
  }

  function deplodeProduct() {
    const parts = scene.children;
    parts.forEach(function (i, v) {
      i.position.x =
        distances[v].originalX +
        (distances[v].explodedDistanceX / 100) * previousExplosionFactor -
        (distances[v].explodedDistanceX / 100) * explosionFactor;
      i.position.y =
        distances[v].originalY +
        (distances[v].explodedDistanceY / 100) * previousExplosionFactor -
        (distances[v].explodedDistanceY / 100) * explosionFactor;
      i.position.z =
        distances[v].originalZ +
        (distances[v].explodedDistanceZ / 100) * previousExplosionFactor -
        (distances[v].explodedDistanceZ / 100) * explosionFactor;
    });
  }

  return (
    <>
      <primitive object={scene} onClick={click} />
    </>
  );
};

export default Model;
